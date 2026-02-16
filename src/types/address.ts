// src/types/address.ts
export interface Address {
    street: string;          // Calle
    number: string;          // Número de casa o edificio
    between: [string, string]; // Entre calles: [calle1, calle2]
    neighborhood: string;    // Reparto o barrio
    municipality: string;    // Municipio (ej. "Plaza de la Revolución")
    province: string;        // Provincia (ej. "La Habana")
}