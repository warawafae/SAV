CREATE TABLE electroplanet_magasin(
nom_magasin VARCHAR(50) NOT NULL,
nom_complet_responsable VARCHAR(50) NOT NULL,
email_responsable VARCHAR(50) NOT NULL
);
INSERT INTO electroplanet_magasin(nom_magasin,nom_complet_responsable,email_responsable)
VALUES('Electroplanet HAY RIAD','fatehi ismail','fatehi ismail@gmail.com'),
('Electroplanet ROUTE D''IMOUZZER','mari iyad','mariiyad@gmail.com'),
('Electroplanet DIOUR JAMAA','nour ishaq','nourishaq@gmail.com'),
('Electroplanet SAADA','rabi youssouf','rabiyoussouf@gmail.com'),
('Electroplanet AIN SEBAA','lami bilal','lamibilal@gmail.com'),
('Electroplanet MEKNES','souni mehdi','sounimehdi@gmail.com'),
('Electroplanet VILLE NOUVELLE','wahdi qassim','wahdiqassim@gmail.com'),
('Electroplanet MASSIRA','maghi malika','maghimalika@gmail.com');
CREATE TABLE electroplanet_technicien(
nom_complet_technicien VARCHAR(50) NOT NULL,
email_technicien VARCHAR(50) NOT NULL,
spécialité VARCHAR(50) NOT NULL,
statut VARCHAR(50) NOT NULL
);
INSERT INTO electroplanet_technicien(nom_complet_technicien,email_technicien,spécialité,statut)
VALUES('zahi mohammed','zahimohammed@gmail.com','Ordinateur portable','disponible'),
('jihab hamza','jihabhamza@gmail.com','Smartphone','disponible'),
('dari moussa','darimoussa@gmail.com','Plaque de cuisson','disponible'),
('bazi wassim','baziwassim@gmail.com','Plaque de cuisson','non disponible'),
('bourab younes','bourabyounes@gmail.com','TV','disponible'),
('razi ayoub','raziayoub@gmail.com','Machine à laver','non disponible'),
('moussa naji','moussanaji@gmail.com','Climatiseur','disponible'),
('zourbi nadir','zourbinadir@gmail.com','Chauffe-eau electrique','disponible'),
('bar wafae','bararawafaa@gmail.com','Climatiseur','non disponible');

SELECT * FROM electroplanet_magasin;
SELECT * FROM electroplanet_technicien;
CREATE TABLE electroplanet_reclamations(
    id INT IDENTITY(1,1) PRIMARY KEY,
    nom_client NVARCHAR(100),
    numero_telephone NVARCHAR(20),
    libelle NVARCHAR(255),
    contrat NVARCHAR(100),
    nom_responsable NVARCHAR(100),
    nom_magasin NVARCHAR(100),
    enseigne NVARCHAR(50),
    spécialité_technicien NVARCHAR(100),
    nom_technicien NVARCHAR(100),
    email_technicien NVARCHAR(100),
    date_reclamation DATETIME DEFAULT GETDATE()
);
SELECT * FROM electroplanet_reclamations;
ALTER TABLE electroplanet_reclamations
ADD 
    duree_vie NVARCHAR(50), 
    statut_reclamation NVARCHAR(50) DEFAULT 'ouverte', 
    motif NVARCHAR(500);  