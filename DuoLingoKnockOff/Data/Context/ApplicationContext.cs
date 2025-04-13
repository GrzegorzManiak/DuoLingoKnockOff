using Microsoft.EntityFrameworkCore;

namespace DuoLingoKnockOff.Data.Context;

public class ApplicationContext(DbContextOptions<ApplicationContext> options) : DbContext(options)
{
    
}