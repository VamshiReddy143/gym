import Image from "next/image";
import gymlogo from "@/public/gymlogo.jpg";


const schedule = [
  { time: "6:00am - 8:00am", monday: "HIIT", tuesday: "Cardio", wednesday: "Yoga", thursday: "Strength Training", friday: "CrossFit", saturday: "Pilates", sunday: "Rest" },
  { time: "10:00am - 12:00pm", monday: "Functional Training", tuesday: "Weight Training", wednesday: "Boxing", thursday: "Spin Class", friday: "Body Building", saturday: "Zumba", sunday: "Rest" },
  { time: "5:00pm - 7:00pm", monday: "Kickboxing", tuesday: "Yoga", wednesday: "Strength Training", thursday: "HIIT", friday: "Mobility & Recovery", saturday: "Athletic Conditioning", sunday: "Rest" },
  { time: "7:00pm - 9:00pm", monday: "Cardio", tuesday: "Weight Lifting", wednesday: "CrossFit", thursday: "Pilates", friday: "Zumba", saturday: "Open Gym", sunday: "Rest" },
];

const Timetable = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 shadow-lg mt-10 rounded-lg">
      <div className="flex  mb-10 items-center justify-center gap-2">
          <Image src={gymlogo} alt="Gym Logo" width={600} height={600} className="object-contain  h-10 w-10" />
          <h1 className="sm:text-3xl font-serif font-bold">
            FITN<strong className="text-orange-500">ASE</strong>
          </h1>
        </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-white text-lg">
          <thead>
            <tr className="bg-orange-700 text-white">
              <th className="p-4">Time</th>
              <th className="p-4">Monday</th>
              <th className="p-4">Tuesday</th>
              <th className="p-4">Wednesday</th>
              <th className="p-4">Thursday</th>
              <th className="p-4">Friday</th>
              <th className="p-4">Saturday</th>
              <th className="p-4">Sunday</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr key={index} className="border border-gray-800 hover:bg-gray-800 transition">
                <td className="p-4 text-orange-400 font-semibold">{row.time}</td>
                {Object.keys(row).slice(1).map((day, i) => (
                  <td
                    key={i}
                    className={`p-4 text-center transition-all duration-500 ${row[day] ? "hover:bg-orange-500 hover:rounded-lg  hover:text-black" : "bg-gray-800 text-gray-500"}`}
                  >
                    {row[day] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;