import Features from '../components/Features';
import Slider from '../components/Slider';
import HomeSlider from '../components/HomeSlider';
import Stats from '../components/States';
import ContactUs from '../components/ContactUs';
function HomePage() {
    return (
        <div className="container mx-auto bg-gray-50 ">
            <HomeSlider />
            <h1 className="text-center text-4xl font-bold text-green-700 my-8">Welcome to Our Platform</h1>
            <Stats />
            <Features className="my-8" />
            <Slider className="my-14" />
            <ContactUs className="my-8 mx-auto " />
        </div>
    );
}

  

export default HomePage;
