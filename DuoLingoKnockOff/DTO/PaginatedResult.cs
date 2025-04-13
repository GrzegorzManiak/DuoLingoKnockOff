namespace DuoLingoKnockOff.DTO;

public class PaginatedResult<T>(IEnumerable<T> items, int totalCount, int page, int pageSize)
{
    public IEnumerable<T> Items { get; set; } = items;
    public int TotalCount { get; set; } = totalCount;
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
} 