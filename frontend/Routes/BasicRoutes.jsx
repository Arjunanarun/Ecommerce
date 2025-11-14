import Nav from '../Components/Nav';
import HeroSlider from "../Components/HeroSlider";
import NewArrival from '../src/NewArraival';
import Collections from "../src/Collections";
import TestimonialSection from "../Components/TestimonialSection";
import NewsletterSection from '../Components/NewsletterSection';
import Footer from '../Components/MobileMenu';
import {Outlet} from 'react-router-dom';

export default function BasicRoutes(){
    return(
        <>
            <Nav/>
            <HeroSlider/>
            <NewArrival/>
            <Collections/>
            <TestimonialSection/>
            <NewsletterSection/>
            <Footer/>
        </>
    )
}

