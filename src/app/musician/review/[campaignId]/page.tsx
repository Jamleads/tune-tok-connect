
'use client';

import ReviewContent from "@/pages/musician/ReviewContent";
import { useParams } from "next/navigation";

export default function ReviewContentPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  
  return <ReviewContent campaignId={campaignId} />;
}
