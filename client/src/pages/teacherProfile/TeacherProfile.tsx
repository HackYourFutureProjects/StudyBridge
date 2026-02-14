import { useState } from "react";
import {
  Sidebar,
  defaultTeacherMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/headerPrivate/TopBar";
import { Button } from "../../components/ui/button/Button";
import { SelectComponent } from "../../components/ui/select/select";

export const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Anna Tkachuk");
  const [email, setEmail] = useState("daryna2003tk@gmail.com");
  const [phone, setPhone] = useState("+");
  const [price, setPrice] = useState("default");
  const [experience, setExperience] = useState("default");
  const [education, setEducation] = useState("default");
  const [aboutMe, setAboutMe] = useState("");

  const priceOptions = [
    { label: "Price one lesson", value: "default" },
    { label: "$20 per lesson", value: "20" },
    { label: "$30 per lesson", value: "30" },
    { label: "$40 per lesson", value: "40" },
    { label: "$50 per lesson", value: "50" },
  ];

  const experienceOptions = [
    { label: "My experience", value: "default" },
    { label: "Less than 1 year", value: "0-1" },
    { label: "1-3 years", value: "1-3" },
    { label: "3-5 years", value: "3-5" },
    { label: "5+ years", value: "5+" },
  ];

  const educationOptions = [
    { label: "My education", value: "default" },
    { label: "Bachelor's Degree", value: "bachelor" },
    { label: "Master's Degree", value: "master" },
    { label: "PhD", value: "phd" },
    { label: "Certificate", value: "certificate" },
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pl-[218px] bg-[#15141D]">
      <Sidebar items={defaultTeacherMenuItems} />

      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <TopBar />

        <div className="pt-10 flex-1">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-12">
            My profile
          </h1>

          <div className="flex gap-12">
            <div className="flex-shrink-0">
              <div className="w-[220px] h-[220px] rounded-3xl bg-gray-700 flex items-center justify-center">
                <button className="text-purple-400 text-6xl font-light hover:text-purple-300 transition-colors">
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-4xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent bg-transparent border-b border-purple-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent">
                    {name}
                  </h2>
                )}
                <Button
                  onClick={isEditing ? handleSave : handleEdit}
                  variant="secondary"
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-white text-base w-24">E-mail:</label>
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="w-full max-w-md px-4 py-2 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-white text-base w-24">Phone:</label>
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="w-full max-w-md px-4 py-2 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                <button className="text-white underline hover:text-purple-400 transition-colors">
                  Change password
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <label className="text-white text-base w-32">Price:</label>
              <div className="relative">
                <SelectComponent
                  options={priceOptions}
                  defaultValue={price}
                  onChange={setPrice}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-white text-base w-32">Experience:</label>
              <div className="relative">
                <SelectComponent
                  options={experienceOptions}
                  defaultValue={experience}
                  onChange={setExperience}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-white text-base w-32">Education:</label>
              <div className="relative">
                <SelectComponent
                  options={educationOptions}
                  defaultValue={education}
                  onChange={setEducation}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <button className="text-purple-400 underline hover:text-purple-300 transition-colors ml-32">
              Lesson sсhedule
            </button>
          </div>

          <div className="mt-12 mb-12">
            <div className="flex items-start gap-4">
              <label className="text-white text-base w-32 pt-2">
                About me:
              </label>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="About me:"
                disabled={!isEditing}
                rows={6}
                className="flex-1 max-w-4xl px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

