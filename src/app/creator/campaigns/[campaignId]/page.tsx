
'use client';

import CampaignDetail from "@/pages/creator/CampaignDetail";
import { useParams } from "next/navigation";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  
  return <CampaignDetail campaignId={campaignId} />;
}
