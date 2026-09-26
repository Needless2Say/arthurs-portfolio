"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

// Static export has no server, so the redirect off the bare basePath root
// happens client-side, on mount.
export default function RootRedirect() {
	const router = useRouter();

	useEffect(() => {
		router.replace(ROUTES.HOME);
	}, [router]);

	return null;
}
