import character from "../data/character.json";
import CharacterListItem from "./CharacterListItem";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useState, useEffect } from "react";

const initialPage = 'https://rickandmortyapi.com/api/character'

const MyList = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [nextPage, setNextPage] = useState('');

  const fetchPage = async (url: string) => {
    if (loading) {
      return
    }

    setLoading(true);
    const response = await fetch(url);
    const responseJson = await response.json();
    // console.log(JSON.stringify(responseJson, null , 2)) user friendly view of the json in the console

    setItems((existingItems) => {
      return [...existingItems, ...responseJson.results]
    });
    setNextPage(responseJson.info.next);

    setLoading(false);
  }

  const onRefresh = () => {
    setItems([])
    setNextPage(initialPage)
    fetchPage(initialPage)
  }

  useEffect(() => {
    fetchPage(initialPage)
  }, [])

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <CharacterListItem character={item} />}
      contentContainerStyle={{ gap: 10 }}
      onEndReached={() => fetchPage(nextPage)}
      onEndReachedThreshold={3}
      ListFooterComponent={() => loading && <ActivityIndicator />}
      refreshing={loading}
      onRefresh={onRefresh}
      // debug={true}
    />
  );
};

export default MyList;
