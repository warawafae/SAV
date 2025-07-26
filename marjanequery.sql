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
ALTER TABLE marjane_magasin
ADD mot_de_passe VARCHAR(255);
UPDATE marjane_magasin 
SET mot_de_passe ='@saa6'
WHERE nom_complet_responsable='sali amir';
