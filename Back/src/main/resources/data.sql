insert into states (name)
values ('NULL'),
('Buenos Aires'),
('CABA'),
('Capital Federal'),
('Catamarca'),
('Chaco'),
('Chubut'),
('Córdoba'),
('Corrientes'),
('Entre Ríos'),
('Formosa'),
('Jujuy'),
('La Pampa'),
('La Rioja'),
('Mendoza'),
('Misiones'),
('Neuquén'),
('Río Negro'),
('Salta'),
('San Juan'),
('San Luis'),
('Santa Cruz'),
('Santa Fe'),
('Santiago del Estero'),
('Tierra del Fuego'),
('Tucumán');

-- Users (admin, user1/seller, delivery, user.../buyer):
insert into users (username, password,date_time,role,
                   email, name, lastname,phone,dni,dni_type,
                   id_state,direction,number_dir,postal_num,floor,room,
                   cvu)
values ('admin','$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2','2023-01-01 00:00:01','ADMIN',
        'marcozlanuz@gmail.com','admin','admin', '351647', '449922', 'DNI',
        2, 'Tercero Arriba', '333', '5001','1','2',
        '832032608255661')
       ,
    ('seller','$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2','2023-02-01 00:00:01','USER'
    ,'test_user_482362958@testuser.com','pablo','perez', '371647', '439922', 'DNI',
    3, 'Tercero Abajo', '222', '5002','3','4',
    '3267837162397314')
       ,
    ('user1','$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2','2023-02-01 00:00:01','USER'
    ,'test_user_1617525073@testuser.com','servo','marces', '361647', '429922', 'DNI',
    3, 'Tercero Atreas', '111', '5003','','','');
insert into users (username, name, lastname, password, email,role,id_state,date_time)
values ('delivery','del','iver','$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2',
        'del@a', 'DELIVERY',1,'2023-04-01 00:00:01'),
        ('user2','a','a', '$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2',
        'a2@a', 'USER',1,'2023-02-02 00:00:01'),
        ('user3','a','a', '$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2',
        'a3@a', 'USER',1,'2023-06-01 00:00:01'),
        ('user4','a','a', '$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2',
        'a4@a', 'USER',1,'2023-09-02 00:00:01'),
        ('user5','a','a', '$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2',
        'a5@a', 'USER',1,'2023-09-04 00:00:01'),
        ('user@a','a','a','$2a$10$HYrDVRKzhpB0MRSSz5/lgeOiRdiFxD9bYuG3cFFe9tdDRcjjNUyX2',
        'a6@a', 'USER',1,'2023-11-01 00:00:01');

-- Publications:
insert into publications (id_user, name, description, type, difficulty,can_sold,count,price,deleted, draft,date_time)
values (1,'Panal artesanal', 'esto es un panal de abejas artesanal #bees', 'ARTE',1,true,5,5,false
       ,false,'2023-1-01 00:00:01');
insert into sections (id_publication, type, text)
values (1,'PHOTO', ''),
       (1,'MAT', 'madera'),
       (1,'COND', 'tenga cuidaddo con el panal');
insert into sections (id_publication, type, text, number)
values  (1,'STEP', 'Cerrar es un panal de abejas', 2),
        (1,'STEP', 'Abrir es un panal de abejas', 1);


insert into publications (id_user, name, description, type, difficulty,can_sold,count,price,deleted, draft,date_time)
values (2,'Casa de pajaros', 'esto es ', 'ARTE',1,true,5,5,false, false,'2023-1-02 00:00:01');
insert into sections (id_publication, type, text)
values (2,'PHOTO', '');


insert into publications (id_user, name, description, type, difficulty,can_sold,deleted ,draft,date_time)
values (2,'Casa de perros ', 'pajaros', 'TECNOLOGIA',1,false,false,false,'2023-2-01 00:00:01');
insert into sections (id_publication, type, text)
values (3,'PHOTO', '');

-- Drafts:
insert into publications (id_user, name, description, type, difficulty,can_sold,deleted ,draft,date_time)
values (1,'Casa de peldos ', 'pajaros', 'TECNOLOGIA',1,false,false,true,'2023-4-01 00:00:01');
insert into sections (id_publication, type, text)
values (4,'PHOTO', '');

-- Sales:

insert into sales (merchant_order,id_user,date_time,sale_state)
values (3,1, '2024-4-01 00:00:01','APROBADA');
insert into sale_details (id_sale,id_publication,total,count)
values (1,1, 5,1);
insert into deliveries (id_sale,id_dealer,date_time,delivery_state)
values (1,4, '2024-4-01 00:00:01','ENTREGADO');

insert into sales (merchant_order,id_user,date_time,sale_state)
values (4,1, '2024-4-01 00:00:01','APROBADA');
insert into sale_details (id_sale,id_publication,total,count)
values (2,1, 5,1);
insert into sale_details (id_sale,id_publication,total,count)
values (2,2, 5,1);
insert into sale_details (id_sale,id_publication,total,count)
values (2,3, 5,1);
insert into deliveries (id_sale,id_dealer,date_time,delivery_state)
values (2,4, '2024-4-01 00:00:01','ENTREGADO');

insert into sales (merchant_order,id_user,date_time,sale_state)
values (3,2, '2024-4-08 00:00:01','APROBADA');
insert into sale_details (id_sale,id_publication,total,count)
values (3,1, 5,1);
insert into deliveries (id_sale,id_dealer,date_time,delivery_state)
values (1,4, '2024-4-08 00:00:01','ENTREGADO');

insert into sales (merchant_order,id_user,date_time,sale_state)
values (3,5, '2024-4-08 00:00:01','APROBADA');
insert into sale_details (id_sale,id_publication,total,count)
values (4,1, 5,1);
insert into deliveries (id_sale,id_dealer,date_time,delivery_state)
values (1,4, '2024-4-08 00:00:01','ENTREGADO');

insert into sales (merchant_order,id_user,date_time,sale_state)
values (3,2, '2024-4-20 00:00:01','APROBADA');
insert into sale_details (id_sale,id_publication,total,count)
values (5,1, 5,1);
insert into deliveries (id_sale,id_dealer,date_time,delivery_state)
values (1,4, '2024-4-20 00:00:01','ENTREGADO');