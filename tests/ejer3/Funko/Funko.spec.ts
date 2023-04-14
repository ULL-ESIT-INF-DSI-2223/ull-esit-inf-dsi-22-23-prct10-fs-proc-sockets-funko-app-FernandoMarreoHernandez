import 'mocha';
import { expect } from 'chai';
import { Funko,Genero,Tipo } from '../../../src/ejer3/Funko/Funko.js';
import chalk from 'chalk';

describe('Funko', () => {
    let Funko1 = new Funko(400, 'Pain','es una figura de la serie Naruto (best anime ever)', Genero.Anime, Tipo.PopXXL,'Naruto', 93,
false, 'cabeza bailona',15.99);
    it('se crea un Funko', () => {
        expect(Funko1).to.be.an.instanceOf(Funko);
    });
    it('se prueban los getters del funko', () => {
        expect(Funko1.GetId()).to.be.equal(400);
        expect(Funko1.GetNombre()).to.be.equal('Pain');
        expect(Funko1.GetDescripcion()).to.be.equal('es una figura de la serie Naruto (best anime ever)');
        expect(Funko1.GetGenero()).to.be.equal(Genero.Anime);
        expect(Funko1.GetTipo()).to.be.equal(Tipo.PopXXL);
        expect(Funko1.GetFranquicia()).to.be.equal('Naruto');
        expect(Funko1.GetIdFranquicia()).to.be.equal(93);
        expect(Funko1.GetExclusivo()).to.be.equal(false);
        expect(Funko1.GetCaracteristicas()).to.be.equal('cabeza bailona');
        expect(Funko1.GetValorNumerico()).to.be.equal(15.99);
    });
    it ('se prueban los setters del funko', () => {
        Funko1.SetId(2);
        Funko1.SetNombre('Naruto');
        Funko1.SetDescripcion('es una figura de la serie Naruto (best anime ever)');
        Funko1.SetGenero(Genero.Anime);
        Funko1.SetTipo(Tipo.PopXXL);
        Funko1.SetFranquicia('Naruto');
        Funko1.SetIdFranquicia(934);
        Funko1.SetExclusivo(false);
        Funko1.SetCaracteristicas('cabeza bailona');
        Funko1.SetValorNumerico(15.99);
        expect(Funko1.GetId()).to.be.equal(2);
        expect(Funko1.GetNombre()).to.be.equal('Naruto');
        expect(Funko1.GetDescripcion()).to.be.equal('es una figura de la serie Naruto (best anime ever)');
        expect(Funko1.GetGenero()).to.be.equal(Genero.Anime);
        expect(Funko1.GetTipo()).to.be.equal(Tipo.PopXXL);
        expect(Funko1.GetFranquicia()).to.be.equal('Naruto');
        expect(Funko1.GetIdFranquicia()).to.be.equal(934);
        expect(Funko1.GetExclusivo()).to.be.equal(false);
        expect(Funko1.GetCaracteristicas()).to.be.equal('cabeza bailona');
        expect(Funko1.GetValorNumerico()).to.be.equal(15.99);
    });
});

