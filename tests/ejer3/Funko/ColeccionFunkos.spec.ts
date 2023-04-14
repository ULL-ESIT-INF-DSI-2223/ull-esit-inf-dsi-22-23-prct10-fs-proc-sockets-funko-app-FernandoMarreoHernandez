import 'mocha';
import { expect } from 'chai';
import { Funko,Genero,Tipo } from '../../../src/ejer3/Funko/Funko.js';
import { ColeccionFunkos } from '../../../src/ejer3/Funko/ColeccionFunkos.js';

describe('ColeccionFunkos', () => {
    let Funko1 = new Funko(104, 'Pain','es una figura de la serie Naruto (best anime ever)', Genero.Anime, Tipo.PopXXL,'Naruto', 920,
false, 'cabeza bailona',15.99);
    let Funko2 = new Funko(11, 'Naruto','es una figura de la serie Naruto (best anime ever)', Genero.Anime, Tipo.PopXXL,'Naruto', 921,
false, 'cabeza bailona',15.99);
    let ColeccionFunkos1 = new ColeccionFunkos([Funko1,Funko2],'Fernando');
    it('se crea una coleccion de Funkos', () => {
        expect(ColeccionFunkos1).to.be.an.instanceOf(ColeccionFunkos);
    });
    it('se prueban los getters de la coleccion de Funkos', () => {
        expect(ColeccionFunkos1.getDuenioColeccion()).to.be.equal('Fernando');
        expect(ColeccionFunkos1.getFunkos()).to.be.eql([Funko1,Funko2]);
        expect(ColeccionFunkos1.getFunko(104)).to.be.eql(Funko1);

    });
    it('se prueban los setters de la coleccion de Funkos', () => {
        ColeccionFunkos1.setDuenioColeccion('Paco');
        expect(ColeccionFunkos1.getDuenioColeccion()).to.be.eql('Paco');
    });
    it('se prueba a añadir y eliminar un Funko', () => {
        let Funko3 = new Funko(12, 'Naruto','es una figura de la serie Naruto (best anime ever)', Genero.Anime, Tipo.PopXXL,'Naruto', 922, false, 'cabeza bailona',15.99);
        ColeccionFunkos1.aniadirFunko(Funko3);
        expect(ColeccionFunkos1.getFunkos()).to.be.eql([Funko1,Funko2,Funko3]);
        ColeccionFunkos1.eliminarFunko(12);
        expect(ColeccionFunkos1.getFunkos()).to.be.eql([Funko1,Funko2]);
    });
});
