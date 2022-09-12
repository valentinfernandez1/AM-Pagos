DROP TABLE IF EXISTS authRole, auth, role ;

CREATE TABLE auth (
    idAuth BIGINT NOT NULL identity(1, 1),
    username NVARCHAR(55) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    walletAddress NVARCHAR(255),
    info NVARCHAR(4000),
    PRIMARY KEY(idAuth),
);


ALTER TABLE auth
    ADD CONSTRAINT [info record should be formatted as JSON] CHECK (ISJSON(info)=1)

CREATE TABLE role (
    idRole BIGINT NOT NULL identity(1, 1),
    roleName NVARCHAR(30) NOT NULL,
    PRIMARY KEY(idRole),
);

INSERT INTO role VALUES('user'),('admin');

CREATE TABLE authRole (
    idAuthRole BIGINT NOT NULL identity(1, 1),
    authFK BIGINT NOT NULL,
    roleFK BIGINT NOT NULL,
    PRIMARY KEY(idAuthRole),
    FOREIGN KEY (authFK) REFERENCES auth(idAuth),
    FOREIGN KEY (roleFk) REFERENCES role(idRole),
);

