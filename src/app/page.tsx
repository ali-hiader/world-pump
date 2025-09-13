import ImagesCarosal from "@/components/images-carosal";
import NewArrivals from "@/components/new_arrivals";
import AboutCompany from "@/components/about_company";
import Services from "@/components/services";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import Newsletter from "@/components/newsletter_signup";

async function HomePage() {
  return (
    <>
      <header id="carousel">
        <ImagesCarosal />
      </header>
      <main className="px-4 sm:px-[2%]">
        <NewArrivals />
        <AboutCompany />
        <Testimonials />
        <Services />
        <div className="w-full h-[500px] mt-24">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.9266120737775!2d74.4284706!3d31.471204899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919066380f46ebd%3A0xb50d6753eb8a188e!2sWorld%20Pumps!5e0!3m2!1sen!2s!4v1757754225661!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
