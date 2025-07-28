CREATE TABLE marjane_magasin(
nom_magasin VARCHAR(50) NOT NULL,
nom_complet_responsable VARCHAR(50) NOT NULL,
email_responsable VARCHAR(50) NOT NULL
);
INSERT INTO marjane_magasin(nom_magasin,nom_complet_responsable,email_responsable)
VALUES 
('MARJANE TANGER II','sam ahmed','samahmed@gmail.com'),
('MARJANE BOUREGR','jan meryem','jammeryem@gmail.com'),
('MARJANE Hay Riad','waydi othmane','waydiothmane@gmail.com'),
('MARJANE FES AGDAL','jan mohamed','janmohmed@gmail.com'),
('MARJANE AGADIR FOUNTY','tali ibrahim','taliibrahim@gmail.com'),
('MARJANE OUJDA','sali amir','saliamir@gmail.com');

CREATE TABLE marjane_technicien(
nom_complet_technicien VARCHAR(50) NOT NULL,
email_technicien VARCHAR(50) NOT NULL,
spécialité VARCHAR(50) NOT NULL,
statut VARCHAR(50) NOT NULL
);
INSERT INTO marjane_technicien(nom_complet_technicien,email_technicien,spécialité,statut)
VALUES('sami iyad','samiiyad@gmail.com','TV','disponible'),
('chami mehdi','chamimehdi@gmail.com','Plaque de cuisson','non disponible'),
('laid omar','laidomar@gmail.com','Machine à laver','disponible'),
('bentali youssef','bentaliyoussef@gmail.com','Plaque de cuisson','non disponible'),
('jani souhail','janimouad@gmail.com','Machine à laver','non disponible'),
('jaybi mouad','jaybimouad@gmail.com','Ordinateur portable','non disponible'),
('tahi karim','tahikarim@gmail.com','Plaque de cuisson','disponible'),
('tili samir','tilisamir@gmail.com','Ordinateur portable','disponible'),
('benfouad omar','benfouadomar@gmail.com','Smartphone','disponible');
SELECT * FROM marjane_magasin;
SELECT * FROM marjane_technicien;
CREATE TABLE marjane_reclamations(
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
SELECT * FROM marjane_reclamations;
ALTER TABLE marjane_reclamations
ADD 
    duree_vie NVARCHAR(50), 
    statut_reclamation NVARCHAR(50) DEFAULT 'ouverte', 
    motif NVARCHAR(500);  