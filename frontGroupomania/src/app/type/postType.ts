export interface Post {
    id: number;
    nom: string;
    userID: number;
    date: string;
    titre: string;
    texte: string;
    position: number;
    enfants: number;
}