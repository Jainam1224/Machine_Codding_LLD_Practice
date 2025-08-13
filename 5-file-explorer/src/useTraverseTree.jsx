const useTraverseTree = () => {
  const insertNode = (tree, folderId, item, isFolder) => {
    if (tree.id === folderId && tree.isFolder) {
      tree.items.unshift({
        id: new Date().getTime(),
        name: item,
        isFolder: isFolder,
        items: [],
      });

      return tree;
    }

    let latestTree = [];
    latestTree = tree?.items?.map((nodes) => {
      insertNode(nodes, folderId, item, isFolder);
    });

    return { ...tree, latestTree };
  };

  return { insertNode };
};

export default useTraverseTree;
