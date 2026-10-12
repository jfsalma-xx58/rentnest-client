import Banner from "../components/Banner";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import PopularLocations from "../components/PopularLocations";
import CustomerReviews from "../components/CustomerReviews";

const Home = () => {
  return (
    <div>
      <Banner />
      <FeaturedProperties />
      <WhyChooseUs />
      <HowItWorks />
      <PopularLocations />
      <CustomerReviews />
    </div>
  );
};

export default Home;