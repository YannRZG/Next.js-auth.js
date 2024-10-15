import { auth } from "@/src/lib/auth";

export default async function Profile() {
    const session = await auth();
    console.log("sessiiion data :", session)

    return (
        <div className="flex flex-col items-center min-h-[83vh]">
            {session?.user ? (
                <>
                    <h1 className="text-2xl">Profil de {session.user.name}</h1> {/* Afficher le nom de l'utilisateur */}
                    <p>Email : {session.user.email}</p>
                    <p>Panier numéro : {session.user.cartId}</p>
                    <ul>
                        <li>Produits dans le panier : {session.user.cart?.items.length}</li>
                    </ul>

                </>
            ) : (
                <h1 className="text-2xl">Veuillez vous connecter pour voir votre profil.</h1> // Message pour les utilisateurs non connectés
            )}
        </div>
    );
}
