import {ReviewCardHome} from './ReviewCardHome';
import avatar1 from '../../../assets/images/Avatar.png';
import avatar2 from '../../../assets/images/Avatar2.png';
import avatar3 from '../../../assets/images/Avatar3.png';
import shapeImage from '../../../assets/images/Shape.png';

const reviews = [
  {
    avatar: avatar1,
    name: 'Cameron Williamson',
    course: 'English',
    review: 'The classes are engaging and focused on real communication. Students see noticeable improvement.',
  },
  {
    avatar: avatar2,
    name: 'Esther Howard',
    course: 'Dutch',
    review: 'The classes are engaging and focused on real communication. Students see noticeable improvement.',
  },
  {
    avatar: avatar3,
    name: 'Darrell Steward',
    course: 'QA / Software Testing',
    review: 'The classes are engaging and focused on real communication. Students see noticeable improvement.',
  }
];

export const ReviewsHome = () => {
  return (
    <section className="section-spacing py-12 sm:py-16 lg:py-20">
      <div className="container-centered mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-bold text-white mb-6 sm:mb-8 lg:mb-10">
            What our clients say
          </h2>
          <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-12 sm:mb-16 lg:mb-20 px-4">
            Students appreciate the practical approach, supportive instructors, and clear learning structure
            across all courses. Many international students highlight fast progress, increased confidence,
            and a comfortable learning environment.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`
      relative flex justify-center
      ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}
    `}
            >
              <div className="relative z-10">
                <ReviewCardHome {...review} />
              </div>

              <img
                src={shapeImage}
                alt=""
                className="
        absolute bottom-[-20px] sm:bottom-[-25px]
        left-1/2 -translate-x-1/2
        w-[280px] sm:w-[350px] lg:w-[393px]
        h-[90px] sm:h-[100px] lg:h-[110px]
        object-cover rounded-2xl
        z-0 pointer-events-none
      "
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};