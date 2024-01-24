import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { useParams } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { client } from "@/utils";
import { ContentfulImage } from "@/components/UI";

interface BlogData {
  fields: {
    title: string;
    descrip: string;
    coverImage: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    content: unknown; // Adjust the type according to your actual content structure
  };
}

const Blog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blogData, setBlogData] = useState<BlogData | null>(null);

  const fetchContentfulData = async () => {
    try {
      setIsLoading(true);
      const response = await client.getEntries<BlogData>({
        content_type: "post",
        "fields.slug": slug,
      });
      console.log(response);
      setBlogData(response.items[0]);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContentfulData();
  }, [slug]);

  return (
    <div className="w-full min-h-screen text-black p-4 md:p-16 py-8">
      {isLoading ? (
        <div className="flex w-full h-full justify-center items-center">
          <PulseLoader />
        </div>
      ) : (
        <div className="rounded-xl bg-secondary p-8 md:p-16 w-full h-full">
          <div className="flex flex-col lg:flex-row justify-center items-center sm:items-start sm:justify-start w-full h-full gap-8">
            <div className="flex w-full md:justify-center">
              <ContentfulImage
                alt={`Cover Image for ${blogData?.fields.title}`}
                src={blogData?.fields.coverImage.fields.file.url}
                width={
                  window.innerWidth >= 1280
                    ? 600
                    : window.innerWidth > 780
                    ? 500
                    : 300
                }
                height={400}
              />
            </div>
            <div className="flex flex-col w-full items-center md:p-4 gap-6">
              <div className="flex w-full  font-semibold text-4xl">
                {blogData?.fields?.title}
              </div>
              <div className="flex w-full text-lg">
                {blogData?.fields?.descrip}
              </div>
            </div>
          </div>
          <div className="flex w-full text-xl py-8 2xl:p-16 ">
            <RichText content={blogData?.fields.content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
