import { useSelector } from "react-redux";
import Header from "../components/pokedex/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "../components/pokedex/PokemonCard";

const Pokedex = () => {
  const [pokemons, setpokemons] = useState([]);
  const [pokemonName, setPokemonName] = useState("");
  const [types, setTypes] = useState([]);
  const [currentType, setCurrentType] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const nameTrainer = useSelector((store) => store.nameTrainer);

  const handlePlusOne = (e) => {
    e.preventDefault();
    setPokemonName(e.target.pokemonName.value);
  };

  const pokemonsByName = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(pokemonName.toLowerCase())
  );

  const paginationLogic = () => {
    //Cantidad de pokemon por pagina
    const POKEMONS_PER_PAGE = 20

    //Pokemons que se van a mostrar en la pagina actual
    const sliceStart = (currentPage - 1 ) * POKEMONS_PER_PAGE
    const sliceEnd = sliceStart + POKEMONS_PER_PAGE
    const pokemonInPage = pokemonsByName.slice(sliceStart, sliceEnd)

    //Ultima pagina
    const lastPage = Math.ceil(pokemonsByName.length / POKEMONS_PER_PAGE) || 1

    //Bloque actual
     const PAGES_PER_BLOCK = 5
     const actualBlock = Math.ceil(currentPage / PAGES_PER_BLOCK)
    
    //paginas que se van a mostrar en el bloque actual
    const pagesInBlock = []
    const minPage = (actualBlock - 1) * PAGES_PER_BLOCK + 1
    const maxPage = actualBlock * PAGES_PER_BLOCK
    for(let i = minPage; i <= maxPage; i++){
      if(i <= lastPage){
        pagesInBlock.push(i)
      }
    }

    return {pokemonInPage, lastPage, pagesInBlock}
  }

   const {lastPage, pagesInBlock, pokemonInPage} = paginationLogic()
  
  useEffect(() => {
    if(!currentType){
    const URL = "https://pokeapi.co/api/v2/pokemon?limit=1281";

    axios
      .get(URL)
      .then((res) => setpokemons(res.data.results))
      .catch((err) => console.log(err));
    }
  }, [currentType]);

  useEffect(() => {
    const URL = "https://pokeapi.co/api/v2/type";

    axios
      .get(URL)
      .then((res) => {
        const newTypes = res.data.results.map((type) => type.name);
        setTypes(newTypes);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if(currentType){
    const URL = `https://pokeapi.co/api/v2/type/${currentType}/`


    axios
    .get(URL)
    .then((res) => {
      const pokemonByType = res.data.pokemon.map(pokemon => pokemon.pokemon)
      setpokemons(pokemonByType)
    }) 
    .catch((err) => console.log(err))
    }
  }, [currentType])

  return (
    <section>
      {/**Seccion de filtros y saludos */}
      <Header />
      <section className="py-6 px-2 ">
        <h3 className="text-red-500 font-semibold">
          Welcome {nameTrainer}
          <span className="text-black">
            , here you can find your favorite pokemon
          </span>
        </h3>

        <form onSubmit={handlePlusOne}>
          <div>
            <input className="text-black w-18 h-10"
              id="pokemonName"
              type="text"
              placeholder="Search your pokemon"
            />
            <button className="h-10 w-16 sm:h-10 sm:w-16 bg-red-500">Search</button>
          </div>

          <select className=" " onChange={(e) => setCurrentType(e.target.value)}>
            <option  value="">All Pokemons</option>
            {types.map((type) => (
              <option className="capitalize" value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </form>
      </section>

          {/* Paginacion */}
          <ul className="flex gap-3 justify-center py-4">
            {
              pagesInBlock.map(numberPage => <li onClick={() => setCurrentPage(numberPage)} className="p-3 bg-red-600 font-bold text-white rounded-md hover:animate-ping cursor-pointer" key={numberPage}>{numberPage}</li>)
            }
          </ul>


      {/** seccion lista de pokemon */}
      <section className="px-6 md:px-12 py-12 grid gap-6 auto-rows-auto grid-cols-[repeat(auto-fill,_minmax(220px,_320px))] justify-center">
        {pokemonInPage.map((pokemon) => (
          <PokemonCard key={pokemon.url} pokemonUrl={pokemon.url} />
        ))}
      </section>
    </section>
  );
};

export default Pokedex;
