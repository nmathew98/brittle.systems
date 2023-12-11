import React from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export interface Article {
	url: string;
	category: string;
	title: string;
	description: string;
	tags: string;
	published: Date;
	modified: Date;
}

export const Search = ({ articles = [] as Article[] }) => {
	const comboboxButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const [query, setQuery] = React.useState("");
	const lastKeyDown = React.useRef<string | null>(null);

	const articlesModifiedDesc = articles.sort(
		(a, b) => Number(b.modified) - Number(a.modified),
	);

	const recentlyUpdatedCategories = [
		...new Set(
			articlesModifiedDesc
				.sort((a, b) => Number(b.modified) - Number(a.modified))
				.map(article => article.category),
		),
	].slice(0, 5);

	const includes = (a: string, b: string) =>
		a
			.toLowerCase()
			.replace(/\s+/g, "")
			.includes(b.toLowerCase().replace(/\s+/g, ""));
	const filtered = articlesModifiedDesc.filter(
		article =>
			includes(article.category, query) ||
			includes(article.title, query) ||
			includes(article.description, query) ||
			includes(article.tags, query),
	);

	return (
		<Combobox
			onChange={(value: Article | null) => {
				if (value.url && lastKeyDown.current === "Enter")
					location.pathname = value.url;
			}}
			nullable>
			{({ value, open }) => (
				<>
					<div className="relative mt-1">
						<div className="relative w-full cursor-default overflow-hidden bg-sky-950 focus-within:bg-white text-left shadow-lg focus:outline-none sm:text-sm">
							<Combobox.Input
								autoFocus
								className="w-full border-none py-4 pl-3 pr-10 text-lg bg-sky-950 transition focus-visible:bg-transparent focus:outline-none text-white placeholder-white focus-visible:placeholder-slate-800 focus-visible:text-slate-800 font-semibold"
								value={query || value?.title}
								placeholder="Search articles ..."
								onKeyDown={event => {
									lastKeyDown.current = event.key;
								}}
								onChange={event => setQuery(event.target.value)}
							/>
							<Combobox.Button
								ref={comboboxButtonRef}
								className="absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-white"
									aria-hidden="true"
								/>
							</Combobox.Button>
						</div>
						<Transition
							as="div"
							leave="transition ease-in"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
							show={open}
							afterLeave={() => setQuery("")}>
							<Combobox.Options className="absolute max-h-60 w-full overflow-auto rounded-xs bg-white focus:outline-none text-base sm:text-sm">
								{filtered.length === 0 && !!query && (
									<div className="relative cursor-default select-none px-4 py-2 text-slate-800 font-medium">
										No articles found
									</div>
								)}
								{filtered.length > 0 &&
									filtered.map(article => (
										<Combobox.Option
											key={article.url}
											className={({ active }) =>
												`relative select-none px-4 py-4 ${
													active
														? "bg-orange-600 text-white"
														: "text-slate-800"
												}`
											}
											onClick={() => {
												location.pathname = article.url;
											}}
											value={article}>
											{({ selected }) => (
												<>
													<span
														className={`block truncate ${
															selected
																? "font-semibold"
																: "font-normal"
														}`}>
														{article.title}
														<br />
														<span className="text-sm sm:text-xs">
															{article.modified.toDateString()}
														</span>
													</span>
												</>
											)}
										</Combobox.Option>
									))}
							</Combobox.Options>
						</Transition>
					</div>
					<div className="mt-12">
						<span className="text-white">Recently updated</span>
						<ul className="text-white list-decimal list-inside">
							{recentlyUpdatedCategories.map(category => (
								<li key={category}>
									<button
										onClick={() => {
											setQuery(category);
											comboboxButtonRef.current?.click();
										}}
										className="group font-semibold focus:outline-none">
										{category}
										<span className="block max-w-0 group-focus-visible:max-w-full group-hover:max-w-full transition-all h-0.5 bg-sky-500"></span>
									</button>
								</li>
							))}
						</ul>
					</div>
				</>
			)}
		</Combobox>
	);
};
