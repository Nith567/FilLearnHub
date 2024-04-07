import React from 'react';
import { useRouter } from 'next/navigation'

const Card = ({ data }) => {
      const router = useRouter()
  const { cid, contract, id, metadata, owner, price, title } = data;

  const handleMetadataButtonClick = () => {
    console.log(metadata);
  };
const imageUrl='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.INx1DjDWV-GPeZqbl4LFYQHaEK%26pid%3DApi&f=1&ipt=f6cd1c4f6bc5b1261a7c3c40298f4f216fbb7351cd024b9ada89113230eefe0e&ipo=images'
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    <img src={imageUrl} alt={title} className="w-full rounded-lg mt-4" />
    <p className="text-gray-600">ID: {id}</p>
    <div className="owner-container overflow-hidden h-12">
      <p className="text-gray-600">Owner: {owner}</p>
    </div>
    <div className="owner-container overflow-hidden h-12">
      <p className="text-gray-600"> {metadata}</p>
    </div>
    <p className="text-gray-600">Price: {price}</p>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      onClick={()=>router.push(`/lists/${id}`) }
    >
      MoreDetails
    </button>

  </div>
  );
};

export default Card;
