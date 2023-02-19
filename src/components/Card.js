import React from "react";

function Card({ pokemonInfo, image, selectCard }) {
  const camelCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const color = [
    "#c0d2ca, #ceb8ec",
    "#c0d2ca, #ceb8ec",
    "#ceb8ec, #ceb8ec",
    "#edc2c4, #edc2c4",
    "#edc2c4, #edc2c4",
    "#edc2c4, #b6d1e5",
    "#ceb8ec, #ceb8ec",
    "#ceb8ec, #ceb8ec",
    "#ceb8ec, #ceb8ec",
    "#c1e0c8, #c1e0c8",
    "#c1e0c8, #c1e0c8",
    "#bfdecb, #b3d3e6",
    "#c2deca, #ceb9eb",
    "#c2deca, #ceb9eb",
    "#c2deca, #ceb9eb",
    "#b5d1e6, #dbcbd1",
    "#b5d1e6, #dbcbd1",
    "#dbcbd1, #dbcbd1",
    "#c0d2ca, #ceb8ec",
    "#c0d2ca, #ceb8ec",
  ];

  return (
    <div
      key={pokemonInfo.name}
      name={pokemonInfo.name}
      onClick={selectCard}
      className={`h-84 text-center border-2 border-dashed rounded-lg p-5 justify-items-center border-black bg-[#edc2c4]`}
      style={{
        backgroundImage: `linear-gradient(${color[pokemonInfo.id - 1]})`,
      }}
    >
      <div className="flex justify-center">
        <img src={image} className="h-36 m-4" alt="pokemon" />
      </div>
      <div className="p-3">
        <h2 className="font-bold">
          {pokemonInfo.name && camelCase(pokemonInfo.name)}
        </h2>
        {pokemonInfo.id && ("000" + pokemonInfo.id).slice(-3)}
      </div>
    </div>
  );
}

export default Card;
