import 'mocha';
import { expect } from 'chai';
import { ColeccionDatos } from '../../../src/ejer3/Funko/ColeccionDatos.js';
import { ColeccionFunkos } from '../../../src/ejer3/Funko/ColeccionFunkos.js';
import { Funko, Genero, Tipo } from '../../../src/ejer3/Funko/Funko.js';
import { Usuario } from '../../../src/ejer3/Usuario/Usuario.js';

describe('ColeccionDatos', () => {
  let Usuario1 = new Usuario('Fernando');
  let Funko1 = new Funko(100, 'Pain','es una figura de la serie Naruto (best anime ever)', Genero.Anime, Tipo.PopXXL,'Naruto', 934,
false, 'cabeza bailona',15.99);
  let Funko2 = new Funko(200, 'Naruto','es una figura de la serie Naruto (best anime ever)', Genero.Anime, Tipo.PopXXL,'Naruto', 935,
false, 'cabeza bailona',15.99);
  let ColeccionFunkos1 = new ColeccionFunkos([Funko1,Funko2],Usuario1.GetNombre());
  let ColeccionDatos1 = new ColeccionDatos([ColeccionFunkos1]);
  it('se crea una coleccion de datos', () => {
    expect(ColeccionDatos1).to.be.an.instanceOf(ColeccionDatos);
  });
  it('se prueban los getters de la coleccion de datos', () => {
    expect(ColeccionDatos1.getDatos()).to.be.eql([ColeccionFunkos1]);
    expect(ColeccionDatos1.getDatosUsuario(Usuario1.GetNombre())).to.be.equal(ColeccionFunkos1);
  }
  );
  it ('se prueba a añadir y eliminar una coleccion', () => {
    ColeccionDatos1.aniadirDatos(ColeccionFunkos1);
    expect(ColeccionDatos1.getDatos()).to.be.eql([ColeccionFunkos1,ColeccionFunkos1]);
    ColeccionDatos1.eliminarDatos(Usuario1.GetNombre());
    expect(ColeccionDatos1.getDatos()).to.be.eql([]);
  });
});

