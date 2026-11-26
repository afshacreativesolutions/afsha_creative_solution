import Testimonials from "@/components/Testimonials";
import type { TestimonialsContent } from "@/lib/cms/types";

export default function TestimonialSection({ content }: { content: TestimonialsContent }) {
  return <Testimonials {...content} />;
}
