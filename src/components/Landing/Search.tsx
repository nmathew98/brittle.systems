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

	const recentlyUpdatedCategories = [
		...new Set(
			articles
				.sort((a, b) => Number(b.modified) - Number(a.modified))
				.map(article => article.category),
		),
	].slice(0, 5);

	const includes = (a: string, b: string) =>
		a
			.toLowerCase()
			.replace(/\s+/g, "")
			.includes(query.toLowerCase().replace(/\s+/g, ""));
	const filtered =
		query === ""
			? articles
			: articles.filter(
					article =>
						includes(article.category, query) ||
						includes(article.title, query) ||
						includes(article.description, query) ||
						includes(article.tags, query),
			  );

	return (
		<div>
			<Combobox
				defaultValue={null}
				onChange={value => {
					location.pathname = value.url;
				}}
				nullable>
				{({ open }) => (
					<>
						<div className="relative mt-1">
							<div className="relative w-full cursor-default overflow-hidden bg-white text-left shadow-lg focus:outline-none sm:text-sm">
								<Combobox.Input
									autoFocus
									className="w-full border-none py-4 pl-3 pr-10 text-lg bg-sky-950 transition focus-visible:bg-transparent focus:outline-none text-white placeholder-slate-100 focus-visible:placeholder-slate-800 focus-visible:text-slate-800 font-semibold"
									displayValue={article =>
										(article as Article)?.title
									}
									placeholder="Search articles ..."
									value={query}
									onBlur={() => setQuery("")}
									onKeyDown={event => {
										if (event.key === "Escape")
											setQuery("");
									}}
									onChange={event =>
										setQuery(event.target.value)
									}
								/>
								<Combobox.Button
									ref={comboboxButtonRef}
									className="absolute inset-y-0 right-0 flex items-center pr-2">
									<ChevronUpDownIcon
										className="h-5 w-5 text-slate-400"
										aria-hidden="true"
									/>
								</Combobox.Button>
							</div>
							<Transition
								as="div"
								leave="transition ease-in"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
								show={Boolean(query) || open}
								afterLeave={() => setQuery("")}>
								<Combobox.Options
									static
									className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xs bg-white py-1 focus:outline-none text-base sm:text-sm">
									{filtered.length === 0 && query !== "" ? (
										<div className="relative cursor-default select-none px-4 py-2 text-slate-800 font-medium">
											No articles found
										</div>
									) : (
										filtered.map(person => (
											<Combobox.Option
												key={person.url}
												className={({ active }) =>
													`relative select-none px-4 py-2 ${
														active
															? "bg-sky-950 text-white"
															: "text-slate-800"
													}`
												}
												value={person}>
												{({ selected }) => (
													<>
														<span
															className={`block truncate ${
																selected
																	? "font-semibold"
																	: "font-normal"
															}`}>
															{person.title}
														</span>
													</>
												)}
											</Combobox.Option>
										))
									)}
								</Combobox.Options>
							</Transition>
							{/* Absolute because otherwise when options open there is a layout shift */}
							{!(query || open) && (
								<div className="mt-2 absolute w-full flex space-x-2 overflow-hidden">
									<span className="text-white font-light">
										Recently updated categories:
									</span>
									{recentlyUpdatedCategories.map(
										(category, idx) => (
											<>
												<button
													key={category}
													onClick={() => {
														setQuery(category);
														comboboxButtonRef.current?.click();
													}}
													className="text-white font-medium focus:italic focus:outline-none">
													{category}
													{idx ===
													recentlyUpdatedCategories.length -
														1
														? ""
														: ","}
												</button>
											</>
										),
									)}
								</div>
							)}
						</div>
					</>
				)}
			</Combobox>
		</div>
	);
};