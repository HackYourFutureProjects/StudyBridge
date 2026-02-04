import client1 from '../../../assets/images/client1.jpg';
import client2 from '../../../assets/images/client2.jpg';
import client3 from '../../../assets/images/client3.jpg';
import client4 from '../../../assets/images/client4.jpg';
import client5 from '../../../assets/images/client5.jpg';
import client6 from '../../../assets/images/client6.jpg';
import client7 from '../../../assets/images/client7.jpg';
import client8 from '../../../assets/images/client8.jpg';
import client9 from '../../../assets/images/client9.jpg';

const clients = [
  client1, client2, client3, client4, client5, client6, client7, client8, client9
];

export const OurClients = () => {
  return (
    <section className="section-spacing">
      <div className="container-centered mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[74px] font-bold mb-4">
            <span className="text-gradient">
              OUR CLIENTS
            </span>
          </h2>

          <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Hey choose our platform for high-quality teaching, flexible learning, and professional support. From beginners to advanced learners, our clients see real progress and lasting results.
          </p>
        </div>

        <div className="flex flex-col gap-0 w-full max-w-6xl mx-auto">
          <div className="flex gap-0">
            {clients.slice(0, 4).map((client, index) => (
              <div key={index} className="flex-1 overflow-hidden">
                <img
                  src={client}
                  alt={`Client ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-0">
            {clients.slice(4, 9).map((client, index) => (
              <div key={index + 4} className="flex-1 overflow-hidden">
                <img
                  src={client}
                  alt={`Client ${index + 5}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};