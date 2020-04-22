class AddAnnouncementToMemberPost < ActiveRecord::Migration[5.2]
  def change
    add_column :member_posts, :announcement, :boolean
  end
end
