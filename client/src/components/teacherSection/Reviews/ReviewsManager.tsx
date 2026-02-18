import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewsTeacher } from "./ReviewsTeacher";
import avatar1 from "../../../assets/images/Avatar.png";
import avatar2 from "../../../assets/images/Avatar2.png";
import avatar3 from "../../../assets/images/Avatar3.png";
import { id } from "zod/v4/locales";

// using fake Id for now until we have the real data structure of reviews from the backend.
const mockReviews = [
  {
    avatar: null,
    name: "Cameron Williamson",
    course: "English",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 3.5,
  },
  {
    avatar: avatar2,
    name: "Esther Howard",
    course: "Dutch",

    rating: 4.0,
  },
  {
    avatar: avatar3,
    name: "Darrell Steward",
    course: "QA / Software Testing",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 4.5,
  },
  {
    avatar: avatar1,
    name: "Jacob Jones",
    course: "Spanish",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 4.5,
  },
  {
    avatar: avatar2,
    name: "Marvin McKinney",
    course: "French",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 3,
  },
];

export const ReviewsManager = () => {
  //   const { id } = useParams<{ id: string }>();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // fetching reviews from the backend with pagination
  const fetchReviews = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const id = 523;
      //TODO : replace the URL with the real endpoint when we have it from the backend.
      console.log(`Fetching page ${currentPage} and Teacher is ${id}`);

      // Simulating an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 500));

      //TODO : replace the dummy data with the real data structure of reviews when we have it from the backend.
      // Mock data to simulate API response

      setReviews((prevReviews: any) =>
        currentPage === 1 ? mockReviews : [...prevReviews, ...mockReviews],
      );
      if (mockReviews.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchReviews(page + 1);
    }
  };

  console.log("reviews in manager", reviews);
  return (
    <ReviewsTeacher
      reviews={reviews}
      isLoading={isLoading}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
    />
  );
};

// Why I cant see anything on the page?
//  why handlemore is not defined?
//
//
