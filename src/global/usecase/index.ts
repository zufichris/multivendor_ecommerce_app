export interface BaseUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
