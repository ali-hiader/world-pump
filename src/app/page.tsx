import ImagesCarosal from "@/components/images-carosal";
import NewArrivals from "@/components/new_arrivals";

async function HomePage() {
  return (
    <>
      <ImagesCarosal />
      <main className="px-4 sm:px-[2%] pb-24">
        <NewArrivals />
      </main>
    </>
  );
}

export default HomePage;
