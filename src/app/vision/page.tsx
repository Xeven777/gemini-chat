import Header from "@/components/Header";
import ImageVision from "@/components/ImageVision";

const page = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-between selection:text-blue-700 selection:bg-yellow-100">
      <Header name="Vision" />
      <ImageVision />
    </main>
  );
};

export default page;
