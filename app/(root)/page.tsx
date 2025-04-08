import BookOverview from "@/components/BookOverview";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BookList from "@/components/BookList";

const Home = () => (
  <>
    <BookOverview />

    <BookList />
  </>
);

export default Home;
