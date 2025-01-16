import BlogsService from "@/services/blogs";
import Image from "next/image";
import { Badge, Container } from "react-bootstrap";

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const response = await BlogsService.index({ status: true });
  const blogs: IBlog[] = response.data ?? [];

  return blogs.map((blog: IBlog) => ({
    slug: blog.slug + "",
  }));
}

async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const response = await BlogsService.detail(slug);
  const blog: IBlog = response.data!;

  return (
    <div className="bg-body-secondary">
      <Container className="py-5">
        <div className="bg-light text-center pt-5 pb-3">
          <h1 className="fw-bold mb-3 px-4">
            <Badge bg="danger" className="mb-2">
              {blog?.topic.label}
            </Badge>{" "}
            {blog?.title}
          </h1>
          <div className="mb-4">By {blog?.author}</div>
          <Image
            src={blog ? blog.thumbnail + "" : "/image/no-image.png"}
            alt={blog?.title + ""}
            width={234 + 300}
            height={132 + 300}
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
          className="px-4 py-5 bg-light"></div>
      </Container>
    </div>
  );
}

export default Page;
