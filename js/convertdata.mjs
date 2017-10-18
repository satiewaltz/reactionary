export const extractMetadata = data =>
  data.slice(2, data.length).map(data => ({
    subject: data.name.slice(0, -3),
    raw_url: data.download_url,
    src: data.html_url
  }));

const mapSingleEntrys = children =>
  // mapSingleEntrys() iterates over each child
  // and builds a simplifed object contiaining
  // only neccessary information.
  children.map(el => {
    const singleEntry = el.children[0].children;

    const description = singleEntry.reduce((acc, curr) => {
      if (curr.type == "text" || curr.type == "inlineCode")
        acc += curr.value;
      return acc;
    }, "");

    const link = singleEntry.reduce((acc, curr) => {
      if (curr.type == "link") acc = [ ...acc, curr.url ];
      return acc;
    }, []);

    // Here we return an array of links, or if there
    // is only one link - just the link itself.
    // And a description if one exists.
    // The 'title' just denote this child's heading.
    return {
      title: singleEntry[0].children[0].value,
      ...(link.length > 1 ? { link } : { link: link[0] }),
      ...(description && { description })
    };
  });

export function computeAST({ subject, src, AST }) {
  // We first filter out all children only for
  // lists - than we map each children
  // for only the data we want. (A title, a link, and a description.)
  const lists = AST.children
    .filter(el => el.type == "list")
    .map(({ children }) => mapSingleEntrys(children));

  // This first removes any duplicate headings so we can
  // mix this array with the list array on a 1:1 ratio.
  // Then it fitlers only headings with children and
  // returns only each heading's text. (Which is all we care about).
  const headings = AST.children
    .filter((el, i, arr) => {
      // Remove adjcent headings from array
      return arr[i + 1] != null && arr[i].type != arr[i + 1].type;
    })
    .filter(el => el.type == "heading" && el.children)
    .filter((el, i, arr) => {
      // Sometimes there is an extra heading at the top
      // of a file that is sums up what the file is about.
      // We remove this since an unequal # of headings and lists
      // arrays will cause some headings to not have child
      // when we combine them into the final output.
      if (
        arr.length > 1 &&
        lists.length > 1 &&
        arr.length !== lists.length &&
        i === 0
      ) {
        return false;
      } else {
        return true;
      }
    })
    .map(({ children }) => ({ topic: children[0].value }));

  const content = headings.map((topic, i) => ({
    ...topic,
    resources: lists[i]
  }));

  return { subject, src, content };
}
