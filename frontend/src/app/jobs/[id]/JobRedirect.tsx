"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JobRedirect({ jobId }: { jobId: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/jobs?job=${jobId}`);
  }, [jobId, router]);
  return null;
}
