class CreatePostReplies < ActiveRecord::Migration[5.2]
  def change
    create_table :post_replies do |t|
      t.string :message
      t.references :user, foreign_key: true
      t.references :member_post, foreign_key: true

      t.timestamps
    end
  end
end
