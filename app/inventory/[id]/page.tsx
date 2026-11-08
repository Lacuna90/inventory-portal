import { mockInventoryItems } from "@/lib/mockData";
import DetailContent from "./detail-content";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockInventoryItems.map((item) => ({
    id: item.id,
  }));
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params;
  const item = mockInventoryItems.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  return <DetailContent item={item} />;
}
