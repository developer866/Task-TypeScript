import { useState, useEffect } from "react";

interface Collection {
  title: string;
  image: string;
  color: "yellow" | "green" | "white";
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: "yellow" | "green" | "white";
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

function Homepage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const heroImages: string[] = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  });

  const collections: Collection[] = [
    {
      title: "Summer Collection",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
      color: "yellow",
    },
    {
      title: "Urban Essentials",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600",
      color: "green",
    },
    {
      title: "Premium Line",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600",
      color: "white",
    },
  ];

  const features: Feature[] = [
    {
      icon: "🎨",
      title: "Unique Designs",
      description: "Exclusive collections you won't find anywhere else",
      color: "yellow",
    },
    {
      icon: "♻️",
      title: "Sustainable",
      description: "Eco-friendly materials and ethical production",
      color: "green",
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Express shipping worldwide in 3-5 days",
      color: "white",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      text: "The quality is absolutely amazing! Every piece feels premium and the designs are so unique.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Entrepreneur",
      text: "Finally found a brand that combines style with sustainability. Love everything I've bought!",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "Designer",
      text: "The attention to detail is incredible. These aren't just clothes, they're wearable art.",
      rating: 5,
    },
  ];

  const handleNewsletterSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ): void => {
    e.preventDefault();
    alert(`Thanks for subscribing: ${email}`);
    setEmail("");
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((image: string, index: number) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                Dress to
                <span className="block bg-linear-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent">
                  Impress
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Discover the latest trends in fashion. Bold. Unique. Timeless.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#shop"
                  className="px-8 py-4 bg-linear-to-r from-yellow-400 to-green-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105"
                >
                  Shop Now
                </a>
                <a
                  href="#collections"
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                  View Collections
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-yellow-400 w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-4">
              Our Collections
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-yellow-400 to-green-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection: Collection, index: number) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-500"
              >
                <div className="aspect-3/4 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {collection.title}
                  </h3>
                  <button
                    className={`px-6 py-2 font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      collection.color === "yellow"
                        ? "bg-yellow-400 text-black"
                        : collection.color === "green"
                          ? "bg-green-500 text-white"
                          : "bg-white text-black"
                    }`}
                  >
                    Explore →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 tracking-wide">
              Why Choose Us
            </h2>
            <div className="w-24 h-[2px] bg-white mx-auto"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature: Feature, index: number) => (
              <div
                key={index}
                className="bg-white/5 border border-white/20 rounded-2xl p-8 
                     hover:bg-white hover:text-black 
                     transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-black">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 group-hover:text-gray-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-4">
              What People Say
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: Testimonial, index: number) => (
              <div
                key={index}
                className="bg-black rounded-2xl p-8 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map(
                    (_, i: number) => (
                      <span key={i} className="text-yellow-400 text-2xl">
                        ★
                      </span>
                    ),
                  )}
                </div>
                <p className="text-white mb-6 text-lg italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-black mb-4">Stay in Style</h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to get exclusive offers and early access to new
            collections
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-full border-2 border-black focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-linear-to-r from-yellow-400 to-green-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
