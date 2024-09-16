import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkCodeblocks from "remark-code-blocks";
const getCodeblock = (markdown: string) => {
	return remark()
		.use(remarkGfm)
		.use(remarkCodeblocks)
		.process(markdown)
		.then((res) => res?.data?.codeblocks || []);
};

export default getCodeblock;
