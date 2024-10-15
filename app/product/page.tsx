import { auth } from "../../src/lib/auth";
import ProductsPage from "../components/ProductsPage"; // Assurez-vous d'avoir ce composant

export default async function Products() {
  const session = await auth(); // Récupérer la session côté serveur
  const userId = session?.user?.cartId || null;

  return (
    <div>
      <ProductsPage userId={userId} /> {/* Passez l'ID utilisateur en tant que prop */}
    </div>
  );
}
