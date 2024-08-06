"use client";
import { Poppins } from "next/font/google";
import Head from "next/head";
import TakeQuizButton from "@/components/take_quiz_button";
import AnswerQuiz from "@/components/answer_quiz";
import { useEffect, useState } from "react";
import QuizResult from "@/components/quiz_result";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const poppins = Poppins({ subsets: ["latin"], weight: "400" });
export default function Home() {
	const [content, setContent] = useState("");
	const [answer, setAnswer] = useState("");
	const [quiz, setQuiz] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (content === "show-quiz") {
			setIsLoading(true);
			fetch(`${BASE_URL}/api/v1/quiz`)
				.then((response) => {
					response.json().then((quiz) => {
						setQuiz(quiz);
						setContent("show-quiz");
					});
				})
				.catch((error) => {
					console.error("Error fetching quiz data:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [content]);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="h-screen grid place-items-center bg-white">
				<div className="h-[500px] aspect-video border py-5 px-4 flex flex-col justify-center">
					<div>
						<TakeQuizButton
							onClick={() => setContent("show-quiz")}
							disabled={isLoading}
						/>
						<div className="mt-8">
							{content === "show-quiz" && quiz && !isLoading && (
								<AnswerQuiz
									quiz={quiz}
									onSettled={(answer) => {
										setAnswer(answer);
										setContent("show-result");
									}}
								/>
							)}
							{isLoading && <p>Loading quiz ...</p>}
							{content === "show-result" && (
								<QuizResult answer={answer} />
							)}
							{!content && (
								<p className="text-lg font-semibold">
									Welcome to the Quiz App! Click the button
									above to take a quiz.
								</p>
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
