// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/src/lib/auth"; // Assurez-vous que le chemin est correct

export const { GET, POST } = handlers;
