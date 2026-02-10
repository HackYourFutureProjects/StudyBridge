import { TeacherType } from "../../api/teacher/teacher.type";

const teachers: TeacherType[] = [
  {
    id: "1",
    firstName: "Els",
    lastName: "Menson",
    email: "aasd@gmail.com",
    profileImageUrl: null,
    experience: 12,
    bio: "Communicative, student-centered methodology focused on real-life English. Lessons emphasize speaking practice, practical vocabulary, and personalized learning goals.",
    headline: null,
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    priceFrom: 35,
    mainLanguage: "English",
    education: [{ degree: "Master", institution: "University of Amsterdam" }],
    subjects: [
      {
        _id: "12",
        subjectName: "English",
        levels: ["C1", "B2"],
        experienceYears: 10,
        hourlyRate: 35,
      },
    ],
    availability: {
      monday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      tuesday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      wednesday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      thursday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      friday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      saturday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      sunday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
    },
    address: {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
    },
    createdAt: new Date(),
    role: "teacher",
  },
  {
    id: "2",
    firstName: "Els",
    lastName: "Menson",
    email: "aasd@gmail.com",
    profileImageUrl: null,
    experience: 12,
    bio: "Communicative, student-centered methodology focused on real-life English. Lessons emphasize speaking practice, practical vocabulary, and personalized learning goals.",
    headline: null,
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    priceFrom: 35,
    mainLanguage: "English",
    education: [{ degree: "Master", institution: "University of Amsterdam" }],
    subjects: [
      {
        _id: "12",
        subjectName: "English",
        levels: ["C1", "B2"],
        experienceYears: 10,
        hourlyRate: 35,
      },
    ],
    availability: {
      monday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      tuesday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      wednesday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      thursday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      friday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      saturday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      sunday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
    },
    address: {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
    },
    createdAt: new Date(),
    role: "teacher",
  },
  {
    id: "3",
    firstName: "Els",
    lastName: "Menson",
    email: "aasd@gmail.com",
    profileImageUrl: null,
    experience: 12,
    bio: "Communicative, student-centered methodology focused on real-life English. Lessons emphasize speaking practice, practical vocabulary, and personalized learning goals.",
    headline: null,
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    priceFrom: 35,
    mainLanguage: "English",
    education: [{ degree: "Master", institution: "University of Amsterdam" }],
    subjects: [
      {
        _id: "12",
        subjectName: "English",
        levels: ["C1", "B2"],
        experienceYears: 10,
        hourlyRate: 35,
      },
    ],
    availability: {
      monday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      tuesday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      wednesday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      thursday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      friday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      saturday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
      sunday: [
        {
          start: "8AM",
          end: "9PM",
        },
      ],
    },
    address: {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
    },
    createdAt: new Date(),
    role: "teacher",
  },
];

import { Filters } from "../../components/filters/Filters";
import { CardsList } from "../../components/cardsList/CardsList";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { useState } from "react";

export const TeachersPage = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div
      className="
            flex items-center
            flex-col justify-center w-full max-w-360 mx-auto mt-20 py-20 px-20
            "
    >
      <h1 className="auth-title">OUR TEACHERS</h1>
      <h3 className="text-[16px] text-light-100 w-full max-w-170.75 text-center mb-20">
        Hey choose our platform for high-quality teaching, flexible learning,
        and professional support. From beginners to advanced learners, our
        clients see real progress and lasting results.
      </h3>
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
        <Filters />
        <div className="flex flex-col gap-10">
          <CardsList cards={teachers} />
          <div className="flex flex-col items-center gap-5">
            <h4 className="text-[18px] md:text-[24px] text-light-100">
              1,500 profiles found
            </h4>
            <Pagination
              theme={"primary"}
              shape={"round"}
              activeIndex={activeIndex}
              onIndexChange={setActiveIndex}
              totalPages={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
