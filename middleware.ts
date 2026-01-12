// middleware.ts
// ✅ Middleware neutre — ne redirige plus vers /fr ni ne modifie les routes.
// Compatible avec Next.js 15+ / 16 et Turbopack.

import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // 🚀 Middleware neutre : il laisse simplement passer la requête.
  return NextResponse.next();
}

// ⚙️ Configuration : aucune route spécifique interceptée.
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
