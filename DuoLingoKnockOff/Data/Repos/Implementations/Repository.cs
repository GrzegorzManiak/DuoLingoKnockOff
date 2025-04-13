
using DuoLingoKnockOff.Data.Context;
using Microsoft.EntityFrameworkCore;

public class Repository<T>(ApplicationContext context)
    where T : class
{
    // -- Cant be private as they are used in derived classes
    protected readonly ApplicationContext _context = context;
    protected readonly DbSet<T> _dbSet = context.Set<T>();

    public virtual async Task<T> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public virtual void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public virtual void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public virtual async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}