import { pgTable, serial, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;
export type FeedFollow = typeof feedFollows.$inferSelect;
export type post=typeof posts.$inferSelect;
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull().unique(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  last_fetched_at: timestamp("last_fetched_at")
});

export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),

    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    feed_id: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      uniqueUserFeed: {
        columns: [table.user_id, table.feed_id],
        unique: true,
      },
    };
  }
);
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),

  title: text("title").notNull(),

  url: text("url")
    .notNull()
    .unique(),

  description: text("description"),

  publishedAt: timestamp("published_at"),

  feedId: uuid("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade" }),
});
