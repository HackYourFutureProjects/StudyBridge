import { useState, useMemo } from "react";
import { Calendar } from "./Calendar/Calendar";
import { Time } from "./Time/Time";
import { TeacherType } from "../../../api/teacher/teacher.type";
import { useModalStore } from "../../../store/modals.store";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { SelectComponent } from "../../ui/select/Select.tsx";
import { Button } from "../../ui/button/Button";
import { getDescriptionValidation } from "../../../utils/appointmentDescription.validation";

interface TeacherScheduleProps {
  teacher?: TeacherType;
}

export default function TeacherSchedule({ teacher }: TeacherScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeAndBook, setShowTimeAndBook] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [showSubjectLevelSelection, setShowSubjectLevelSelection] =
    useState<boolean>(false);

  const { open: openModal } = useModalStore();
  const user = useAuthSessionStore((state) => state.user);

  const isOwnProfile = user?.id === teacher?.id;
  const isAuthenticated = !!user;
  const isTeacher = user?.role === "teacher";

  const { data } = useTeacherAppointmentsQuery(
    isAuthenticated ? teacher?.id : undefined,
  );

  const appointments = useMemo(() => {
    const allAppointments = data?.appointments || [];
    return allAppointments.filter((apt) => apt.date && apt.time);
  }, [data?.appointments]);

  const regularStudents = useMemo(() => {
    const allAppointments = data?.appointments || [];
    return allAppointments.filter((apt) => apt.isRegularStudent === true);
  }, [data?.appointments]);

  const subjectOptions = useMemo(() => {
    if (!teacher?.subjects) return [];
    return teacher.subjects.map((subject) => ({
      label: subject.subjectName,
      value: subject.subjectName,
    }));
  }, [teacher]);

  const levelOptions = useMemo(() => {
    if (!selectedSubject || !teacher?.subjects) return [];
    const subject = teacher.subjects.find(
      (s) => s.subjectName === selectedSubject,
    );
    if (!subject || !subject.levels || subject.levels.length === 0) return [];

    return subject.levels.map((levelItem) => {
      if (typeof levelItem === "string") {
        return { label: levelItem, value: levelItem };
      }
      return { label: levelItem.level, value: levelItem.level };
    });
  }, [selectedSubject, teacher]);

  const selectedPrice = useMemo(() => {
    if (!selectedSubject || !selectedLevel || !teacher?.subjects) return null;
    const subject = teacher.subjects.find(
      (s) => s.subjectName === selectedSubject,
    );
    if (!subject || !subject.levels || subject.levels.length === 0) return null;

    const levelItem = subject.levels.find((l) => {
      if (typeof l === "string") {
        return l === selectedLevel;
      }
      return l.level === selectedLevel;
    });

    if (!levelItem) return null;

    if (typeof levelItem === "string") {
      return subject.hourlyRate;
    }
    return levelItem.price;
  }, [selectedSubject, selectedLevel, teacher]);

  const descriptionValidation = useMemo(() => {
    return getDescriptionValidation(description);
  }, [description]);

  const { wordCount, isValid: isDescriptionValid } = descriptionValidation;

  const handleDateSelection = (date: Date): void => {
    setSelectedDate(date);
    setShowTimeAndBook(true);
  };

  const handleTimeSelection = (time: string): void => {
    if (!isAuthenticated) {
      openModal("signIn");
      return;
    }

    if (isTeacher) {
      openModal("alert", {
        title: "Cannot Book Lesson",
        message:
          "Teachers cannot book lessons with other teachers. Only students can book lessons.",
      });
      return;
    }

    setSelectedTime(time);
    setShowSubjectLevelSelection(true);
  };

  const handleBooking = () => {
    if (isOwnProfile || isTeacher) {
      return;
    }

    if (!selectedSubject || !selectedLevel) {
      return;
    }

    if (selectedDate && teacher && selectedTime) {
      openModal("bookingConfirm", {
        teacher,
        selectedDate,
        selectedTime,
        selectedSubject,
        selectedLevel,
        selectedPrice: selectedPrice || undefined,
        description,
        onSuccess: () => {
          setSelectedDate(null);
          setShowTimeAndBook(false);
          setSelectedTime(null);
          setShowSubjectLevelSelection(false);
          setSelectedSubject("");
          setSelectedLevel("");
          setDescription("");
        },
      });
    }
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!teacher || !selectedDate) {
      return [];
    }

    const dayName = selectedDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as keyof typeof teacher.availability;

    const dayAvailability = teacher.availability?.[dayName];

    if (!dayAvailability || dayAvailability.length === 0) {
      return [];
    }

    const slots: string[] = [];
    dayAvailability.forEach((slot) => {
      const timeRegex = /^(\d{1,2}):(\d{2})$/;
      const startMatch = slot.start.match(timeRegex);
      const endMatch = slot.end.match(timeRegex);

      if (!startMatch || !endMatch) {
        return;
      }

      const startHour = parseInt(startMatch[1], 10);
      let endHour = parseInt(endMatch[1], 10);

      if (slot.end === "23:59") {
        endHour = 24;
      }

      if (startHour < 0 || startHour > 23) {
        return;
      }

      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    });

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const approvedAppointments = appointments.filter(
      (apt) => apt.status === "approved" && apt.date === formattedDate,
    );

    const bookedTimes = new Set(
      approvedAppointments.map((apt) => apt.time.substring(0, 5)),
    );

    const regularStudentSlots = new Set<string>();
    regularStudents.forEach(
      (student: { weeklySchedule?: Array<{ day: string; hour: number }> }) => {
        if (student.weeklySchedule && Array.isArray(student.weeklySchedule)) {
          student.weeklySchedule.forEach(
            (slot: { day: string; hour: number }) => {
              const slotDayName = slot.day.toLowerCase();
              if (slotDayName === dayName) {
                const slotTime = `${slot.hour.toString().padStart(2, "0")}:00`;
                regularStudentSlots.add(slotTime);
              }
            },
          );
        }
      },
    );

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    const isToday = selectedDateOnly.getTime() === today.getTime();

    return slots.filter((slot) => {
      if (bookedTimes.has(slot) || regularStudentSlots.has(slot)) {
        return false;
      }

      if (isToday) {
        const [hours, minutes] = slot.split(":").map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        return slotTime > now;
      }

      return true;
    });
  };

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full sm:items-start sm:justify-start">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">Schedule</h2>
            {teacher?.timezone && (
              <p className="text-sm text-gray-400 mt-2">
                All times shown in teachers timezone: {teacher.timezone}
              </p>
            )}

            <div className="mt-8 sm:mx-0">
              <Calendar
                onDateSelect={handleDateSelection}
                selectedDate={selectedDate}
              />
            </div>

            {showTimeAndBook && (
              <div className="mt-8">
                <Time
                  onTimeSelect={handleTimeSelection}
                  availableSlots={getAvailableTimeSlots()}
                />
              </div>
            )}

            {showSubjectLevelSelection && selectedTime && (
              <div className="mt-8 p-6 bg-[#1E1D28] rounded-lg border border-[#7286FF]">
                <p className="text-white text-lg font-semibold mb-4">
                  Please select subject and level
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Subject
                    </label>
                    <SelectComponent
                      options={subjectOptions}
                      value={selectedSubject}
                      onChange={(value) => {
                        setSelectedSubject(value);
                        setSelectedLevel("");
                      }}
                      placeholder="Choose a subject"
                    />
                  </div>

                  {selectedSubject && levelOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Level
                      </label>
                      <SelectComponent
                        options={levelOptions}
                        value={selectedLevel}
                        onChange={setSelectedLevel}
                        placeholder="Choose a level"
                      />
                    </div>
                  )}

                  {selectedSubject && selectedLevel && selectedPrice && (
                    <div className="bg-[#15141D] p-4 rounded-lg border border-[#7286FF]">
                      <p className="text-gray-300">
                        <span className="font-medium text-[#7186FF]">
                          {selectedSubject}
                        </span>{" "}
                        - Level {selectedLevel}
                      </p>
                      <p className="text-xl font-bold text-white mt-1">
                        €{selectedPrice}/hour
                      </p>
                    </div>
                  )}

                  {selectedSubject && selectedLevel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell the teacher about your goals, current level, or any specific topics you'd like to focus on..."
                        className={`w-full p-3 bg-[#15141D] border rounded-lg text-white placeholder-gray-400 resize-none ${
                          isDescriptionValid
                            ? "border-[#7286FF]"
                            : "border-red-500"
                        }`}
                        rows={3}
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <span
                          className={`text-xs ${isDescriptionValid ? "text-gray-400" : "text-red-400"}`}
                        >
                          {wordCount}/{descriptionValidation.maxWords} words
                        </span>
                        {!isDescriptionValid && (
                          <span className="text-xs text-red-400">
                            Maximum {descriptionValidation.maxWords} words
                            allowed
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    disabled={
                      !selectedSubject ||
                      !selectedLevel ||
                      !isDescriptionValid ||
                      isOwnProfile ||
                      isTeacher
                    }
                    variant="secondary"
                    className="w-full"
                  >
                    {isOwnProfile
                      ? "You cannot book lessons with yourself"
                      : isTeacher
                        ? "Teachers cannot book lessons"
                        : !isDescriptionValid
                          ? `Please limit description to ${descriptionValidation.maxWords} words`
                          : "Book Now"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
